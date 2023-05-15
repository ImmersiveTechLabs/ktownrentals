import {Router} from 'express'
const router = Router()
import {google} from 'googleapis';
import moment from 'moment'

router.post('/create', (req, res) => {
  // add this in Array
  const orders = [req.body];

  let orderData = [];

  for (let i = 0; i < orders.length; i++) {
    let order = orders[i];
    let name = `${order['name']}`;
    let email = `${order['email']}`;
    let created_at = `${order['created_at']}`;
    let title = `${order['line_items'][0]['title']}`;
    let variant = `${order['line_items'][0]['variant_title']}`;
     variant = variant.slice(0, 1);


    let line_items = [];
    let line_item = order['line_items'];
    for (let j = 0; j < line_item.length; j++) {
        let properties = line_item[j]['properties'];
        for (let k = 0; k < properties.length; k++) {
            line_items.push(properties[k]['value']);
        }

     if (line_item[j]['properties'][1]['value'].length === 7) {
                    line_item[j]['properties'][1]['value'] = '0' + line_item[j]['properties'][1]['value'];
                }


    //  const TIMEOFFSET = '-04:00';
      let line_item_date_time = line_item[j]['properties'][0]['value'] + 'T' + line_item[j]['properties'][1]['value'] + `.000-07:00`;



          line_item_date_time = line_item_date_time.replace(' AM', ':00');
                    line_item_date_time = line_item_date_time.replace(' PM', ':00');



                    line_item_date_time = line_item_date_time.replace(' pm', ':00');
                    line_item_date_time = line_item_date_time.replace(' am', ':00');
        switch (line_item_date_time.slice(11, 13)) {
            case '01':
                line_item_date_time = line_item_date_time.slice(0, 11) + '13' + line_item_date_time.slice(13, 19);
                break;
            case '02':
                line_item_date_time = line_item_date_time.slice(0, 11) + '14' + line_item_date_time.slice(13, 19);
                break;
            case '03':
                line_item_date_time = line_item_date_time.slice(0, 11) + '15' + line_item_date_time.slice(13, 19);
                break;
            case '04':
                line_item_date_time = line_item_date_time.slice(0, 11) + '16' + line_item_date_time.slice(13, 19);
                break;
            case '05':
                line_item_date_time = line_item_date_time.slice(0, 11) + '17' + line_item_date_time.slice(13, 19);
                break;
            case '06':
                line_item_date_time = line_item_date_time.slice(0, 11) + '18' + line_item_date_time.slice(13, 19);
                break;
            case '07':
                line_item_date_time = line_item_date_time.slice(0, 11) + '19' + line_item_date_time.slice(13, 19);
                default:
                    break;
        }
        //

// if include T18 or T19 than this not run otherwise run this

//         if (line_item_date_time.includes('18:00') || line_item_date_time.includes('19:00')) {


//             line_item_date_time = line_item_date_time.replace(':00', ':00');


//         }
//         else {
// //             line_item_date_time = line_item_date_time.replace(':00', '');
//         }

      let end  = ''   ;
      if (variant == '1')  {
       //  line_item_date_time 11 12 index only increase by 1  this is double digit number so 09 becomes 10 11 becomes 12 if 02 becomes 03 must include 0 with single digit number if value become 01 to 07 to change it to 13 to 19 and than add according to situation to it
       end = line_item_date_time.slice(0, 11) + (parseInt(line_item_date_time.slice(11, 13)) + 1) + line_item_date_time.slice(13, 19);
         } else if (variant == '2') {
           end = line_item_date_time.slice(0, 11) + (parseInt(line_item_date_time.slice(11, 13)) + 2) + line_item_date_time.slice(13, 19);
           } else if (variant == '3') {
               end = line_item_date_time.slice(0, 11) + (parseInt(line_item_date_time.slice(11, 13)) + 3) + line_item_date_time.slice(13, 19);
               } else if (variant == '4') {
                   end = line_item_date_time.slice(0, 11) + (parseInt(line_item_date_time.slice(11, 13)) + 4) + line_item_date_time.slice(13, 19);
                   } else if (variant == '8') {
                       end = line_item_date_time.slice(0, 11) + (parseInt(line_item_date_time.slice(11, 13)) + 8) + line_item_date_time.slice(13, 19);
                       }



     orderData.push({
        'name': name,
        'email': email,
        'created_at': created_at,
        'line_items': line_items,
        "title": title,
        "variant": variant,
        'line_item_date_time': line_item_date_time,
        "end": end

    });

    }
}
const getlastorder = orderData[0];
const name = getlastorder.name;
const email = getlastorder.email;
const created_at = getlastorder.created_at;
const line_items = getlastorder.line_items;
const title = getlastorder.title;
const variant = getlastorder.variant;
const line_item_date_time = getlastorder.line_item_date_time;
const end = getlastorder.end;



const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.CALENDAR_ID;

const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version : "v3"});

const auth = new google.auth.JWT(
CREDENTIALS.client_email,
null,
CREDENTIALS.private_key,
SCOPES
);

//  const colorId = title.includes("Boat") ? 10 :6  ;

let colorId = 0;
if (title == "Seadoo Spark Trixx 3up - S3b") {
        colorId = 1;
   } else if (title == "Seadoo RXT-X 3up - SRXb") {
        colorId = 2;
   } else if (title == "Seadoo Spark Trixx 3up - S3a") {
        colorId = 3;
    } else if (title == "Seadoo RXT-X 3up - SRXa") {
          colorId = 4;
    } else if (title == "Seadoo Spark Trixx 2up - S2b") {
         colorId = 5;
    } else if (title == "Seadoo Spark Trixx 2up - S2a") {
          colorId = 6;
    } else if (title == "Boat ATX 20 Type-S") {
        colorId = 7;
    } else if (title == "Boat Mastercraft XT23") {
        colorId = 8;
    } else if (title == "Boat Centurion Ri230") {
        colorId = 9;
    } else if (title == "Boat Crest DLX 220 SLC") {
        colorId = 10;
    }


 const insertEvent = async (event) => {

    try {
        let response = await calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            resource: event
        });
        if (response['status'] == 200 && response['statusText'] === 'OK') {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        return 0;
    }
};





let dateTime = {
    'start': `${line_item_date_time}`,
    'end': `${end}`
           };

 let event = {
    'summary': ` ${name}-${title}`,
    'description': ` ${email} <br> ${line_items}`,
    'start': {
        'dateTime': dateTime['start'],
        'timeZone': 'America/Vancouver'
    },
    'end': {
        'dateTime': dateTime['end'],
        'timeZone': 'America/Vancouver'
    },
    "colorId" : colorId

};



insertEvent(event)
    .then((res) => {
        if (res == 1) {
        } else {
        }
    }
    )
    .catch((err) => {
    });
  res.status(200).send('Webhook received successfully');
});

export default router
