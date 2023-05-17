import { Router } from 'express'
import OrderModel from '../../utils/models/OrderModel.js'
import moment from 'moment'
import axios from 'axios'
import { google } from 'googleapis'
import {sendEmail} from '../../utils/sendEmail.js'
import momentTimeZone from 'moment-timezone'
import verifyRequest from '../middleware/verifyRequest.js'
const router = Router()


router.post('/book', async (req, res) => {
  try {
    const { line_items, name: orderNumber, created_at: createdAt, customer } = req.body;
    const { properties, product_id, variant_title, title, variant_id: variantId } = line_items[0]
    const duration = parseInt(variant_title) + 0.5 // Adding 0.5 will add half hour to the booking date
    const date = properties?.find((p) => p.name === "Date") //booking Date Sent By User
    const time = properties?.find((p) => p.name === "Time")// booking Time Sent By User
    // const waiverForm = req.body.note_attributes?.find((note)=>note.name === "Wavier");
    const bookingDate = moment(date.value).format("YYYY-MM-DD")
    const timeInMoment = moment(time.value, 'hh:mm A');
    const start = timeInMoment.clone().subtract(30, 'minutes').format('hh:mm A');
    const end = timeInMoment.clone().add((duration * 60), 'minutes').format('hh:mm A');
    const product = await OrderModel.create({
      duration: parseInt(variant_title),
      productId: product_id,
      productTitle: title,
      startTime: start,
      endTime: end,
      email:customer.email,
      price:req.body.total_price,
      bookingDate,
      orderNumber,
      variantId,
      createdAt,
      isWaiverFormFilled:null,
    })
    res.status(200).json(product)
  }
  catch (err) {
    res.status(500).json(err.message)
  }

})

router.post('/checkbooking', async (req, res) => {
  try {
    console.log('hekki')
    const { product_id: productId, date: bookingDate,variant_title,open_time,close_time,gap_time } = req.body
    let openingTime = open_time;
    let openMoment = moment(openingTime, "hh:mm a").utcOffset(0,false).format()
    openMoment = openMoment.replace('Z', '-07:00')
    const currentTime = momentTimeZone().tz("America/Vancouver")
    const currentDate = currentTime.clone().format('YYYY-MM-DD')
    currentTime.hour(currentTime.hour() + 1).startOf('hour').minute(0);
    if (currentTime.isAfter(openMoment) && currentDate === bookingDate) {
      openingTime = currentTime.format("hh:mm A");
    }

    const duration = parseInt(variant_title);
    const closingTimeBeforeSubstraction = close_time;
    let closingTimeBeforeSubstractionInMoment = momentTimeZone(closingTimeBeforeSubstraction, 'hh:mm A').utcOffset(0,false);
    const newClosingMoment = closingTimeBeforeSubstractionInMoment.clone().subtract(duration - 0.5, 'hours');
    const closingTime = newClosingMoment.format('hh:mm A');
    // Convert openingTime and closingTime to moment objects
    const openingMoment = moment(openingTime, 'hh:mm A');
    const closingMoment = moment(closingTime, 'hh:mm A');

    // Calculate end time based on duration
    const endMoment = moment("2050-04-28").add(duration, 'hours');

    // Retrieve existing bookings for the product and booking date
    const overlappingBookings = await OrderModel.find({
      productId: productId,
      bookingDate: bookingDate,
    });

    // Filter for available time slots
    const availableSlots = [];
    let currentMoment = openingMoment.clone();

    while (currentMoment.isBefore(closingMoment)) {
      const overlappingBooking = overlappingBookings.find(booking => {
        const bookingStartTime = moment(booking.startTime, 'hh:mm A');
        const bookingEndTime = moment(booking.endTime, 'hh:mm A');

        // Calculate the difference between current moment and booking start time in minutes
        const durationDiff = bookingStartTime.diff(currentMoment, 'minutes');

        return (
          currentMoment.isBetween(bookingStartTime, bookingEndTime, null, '[)') || // Check for overlapping bookings
          (durationDiff >= 0 && durationDiff < duration * 60) // Check for potential conflicts
        );
      });

      if (!overlappingBooking && currentMoment.isBefore(endMoment)) {
        // If no overlapping booking and current moment is before end moment, add to available slots
        availableSlots.push(currentMoment.format('hh:mm A'));
      }

      currentMoment.add(gap_time, 'minutes'); // Move to next time slot (30 minutes interval)
    }

    res.status(200).json(availableSlots);
  } catch (err) {
    console.log(err.message)
  }
})

const UpdateCalender = async (data) => {
  const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
  const calendarId = process.env.CALENDAR_ID;

  // Google calendar API settings
  const SCOPES = 'https://www.googleapis.com/auth/calendar';
  const calendar = google.calendar({ version: "v3" });

  const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
  );


  let events = "";
  let updateId = "";

  const getEvents = async () => {
    try {
      let response = await calendar.events.list({
        auth: auth,
        calendarId: calendarId,
        // timeMin: start,
        // timeMax: end,
        singleEvents: true,
        orderBy: 'startTime'
      });
      if (response.data.items.length === 0) {
        return 0;
      } else {
        return response.data.items;
      }
    } catch (error) {
      return 0;
    }
  };



  getEvents()
    .then((res) => {
      if (res != 0) {
        let events = res;


        events.filter((event) => {
          if (event.summary.includes(data.name)) {
            updateId = event.id;
          }
        });
      }

      let eventId = updateId;

      let startdate = moment(data['bookingDate']).format('YYYY-MM-DD');
      let enddate = moment(data['bookingDate']).format('YYYY-MM-DD');
      let time = data['time'];
      let duration = data['duration'];
      let startdat = moment(`${startdate} ${time}`).format('YYYY-MM-DDTHH:mm:ss');
      let enddat = moment(`${enddate} ${time}`).add(duration, 'hours').format('YYYY-MM-DDTHH:mm:ss');
      let event = {
        'start': {
          'dateTime': startdat,
          'timeZone': 'America/Vancouver'
        },
        'end': {
          'dateTime': enddat,
          'timeZone': 'America/Vancouver'
        }
      };
      const updateEvent = async (eventId, event) => {
        try {
          let response = await calendar.events.patch({
            auth: auth,
            calendarId: calendarId,
            eventId: eventId,
            resource: event
          });
          if (response.data === '') {
            return 1;
          } else {
            return 0;
          }
        } catch (error) {
          return 0;
        }
      };
      updateEvent(eventId, event)
        .then((res) => {
        })
        .catch((err) => {
        });

    })
    .catch((err) => {
    });
}





router.put('/change',verifyRequest, async (req, res) => {
  try {
    const { orderId, time, bookingDate,notification } = req.body
    const duration = req.body.duration + 0.5
    const timeInMoment = moment(time, 'hh:mm A');
    const start = timeInMoment.clone().subtract(30, 'minutes').format("hh:mm A");
    const end = timeInMoment.clone().add(duration, 'hours').format('hh:mm A');
    const order = await OrderModel.findById(orderId)
    order.bookingDate = bookingDate
    order.startTime = start
    order.endTime = end
    await order.save()
    const {orderNumber,productTitle,price} = order
    res.status(200).json({})
    if(notification === true){
      sendEmail({
        email:order.email,
        subject:"Booking Update",
        text:`<div style="padding:10px;">
        <img style="width:200px;" src="https://ci3.googleusercontent.com/proxy/ysPhRbdSt8aR8fTDZBGkzEyhENZPZm07qPwXaUgd4esbMl0my8Y-FD_q3Xr82oUdRN02KlYdp-XD1ssJS1rrtrFgeEaKJ--BB86lUrqxyb54U7wj9xT60TpcGtrCOKU1-9qI=s0-d-e1-ft#https://cdn.shopify.com/s/files/1/0756/2018/8435/files/Ktown_logo_2_4997.png?393" tabindex="0" />
        <h1>Your booking has been updated</h1>
        <span style="font-weight:100;color:gray;">ORDER #100000</span>
        <h2 style="font-weight:normal;">Updated Details </h2>
        <p>${productTitle}S</p>
        <p>Date: ${bookingDate}</p>
        <p>Start Time: ${start}</p>
        <p>End Time: ${end}</p>
        <p>Price: $${price}</p>
      </div>
      `
      })
    }
    UpdateCalender({
      duration: parseInt(duration - 0.5),
      eventId: "7o5fsibjssa6mi5gb40p0q85p8",
      bookingDate,
      time,
      name: order.orderNumber
    })

  } catch (err) {
    res.status(500).json(err)
  }
})

const deleteBookingFromCalender = (req,res,next)=>{
  const data = req.body;


  const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
  const calendarId = process.env.CALENDAR_ID;

  // Google calendar API settings
  const SCOPES = 'https://www.googleapis.com/auth/calendar';
  const calendar = google.calendar({version : "v3"});

  const auth = new google.auth.JWT(
      CREDENTIALS.client_email,
      null,
      CREDENTIALS.private_key,
      SCOPES
  );







  const getEvents = async () => {

try {
let response = await calendar.events.list({
  auth: auth,
  calendarId: calendarId,
  singleEvents: true,
  orderBy: 'startTime'
});

if (response.data.items.length > 0) {
  return response.data.items;
} else {
  return 0;
}
} catch (error) {
return 0;
}
};

// const data = {
//    name : "#1132",
// }
let eventId = "";

// get all the events and filter the event by name and save that event id in eventId variable and run this code to delete event from google calender event id is in get events commands output
const deleteEvent = async (eventId) => {

try {
let response = await calendar.events.delete({
  auth: auth,
  calendarId: calendarId,
  eventId: eventId
});

if (response.data === '') {
  return 1;
} else {
  return 0;
}
} catch (error) {
return 0;
}
};


getEvents()
.then((res) => {
if (res !== 0) {
  res.forEach((event) => {
      if (event.summary.includes(data.name)) {
          eventId = event.id;
          deleteEvent(eventId).then(() => {})
               }
     });
  }
  next()
   })
   .catch((err) => {
      next()
   });

}

const deleteBookingFromDataBase = async (req, res) => {
  try {
    const { name } = req.body
     await OrderModel.deleteOne({
      orderNumber:name
    })
    res.status(200).json("order deleted")
  } catch (err) {
    res.status(500).json(err)
  }
}

router.post('/delete',deleteBookingFromCalender, deleteBookingFromDataBase)


router.post('/custom-form', async(req,res)=>{
  try{
    const {order:orderId} = req.query
    const product = await OrderModel.findOne({
    orderNumber:`#${orderId}`,
  })
  if(!product){
    return res.status(404).json({order:false})
  }
  if(product.isWaiverFormFilled ===  null){
    const {startTime, endTime, duration,productTitle,productId,price} = product;
    const start = moment(startTime, 'hh:mm A').add(30, "minutes").format("hh:mm A")
    const end = moment(endTime, 'hh:mm A').subtract(30, "minutes").format("hh:mm A")
    return res.status(200).json({order:true,title:productTitle,productId:productId,price:price,start, end, duration})
  }
  return res.status(500).json("internal server error")
}
catch(err){
  res.status(500).json(err)
}
})
router.post('/custom-form-submit',async (req,res)=>{
  try{

    const {formUrl, orderId} = req.body

    const order = await OrderModel.findOne({
      orderNumber:`#${orderId}`,
      isWaiverFormFilled:null
    })
    if(!order){
      return res.status(404).json('order not found')
    }
    order.isWaiverFormFilled = formUrl;
    await order.save()
    return res.status(200).json('Success')
  }
  catch(err){
    res.status(500).json(err)
  }

})

export default router
