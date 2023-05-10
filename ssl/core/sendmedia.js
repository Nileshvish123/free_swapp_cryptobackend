var nodemailer = require('nodemailer');

const sendNotification = {}

sendNotification.mailtransporter = (mailObject) => {
   // var transporter = nodemailer.createTransport({
   //    host: 'espsofttechnologies.com',
   //    port: 465,
   //    secure: true,
   //    auth: {
   //       user: 'developer@espsofttechnologies.com',
   //       pass: 'Espsoft123#'
   //    },
   //    tls: {
   //       rejectUnauthorized: false
   //    }
   // });

   var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: `nilesh.espsofttech@gmail.com`,
        pass: `Nilesh123#`
      }
    });


  
   var mailOptions = {
      //from: "developer@espsofttechnologies.com",
      from:'nilesh.espsofttech@gmail.com',
      to: mailObject.to,
      subject: mailObject.subject,
      html: `<div style="background-color:#f4f4f4">
        <div>
           <div style="margin:0px auto;max-width:800px">
              <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%">
                 <tbody>
                    <tr>
                       <td style="direction:ltr;font-size:0px;padding:10px 0px;text-align:center">
                       </td>
                    </tr>
                 </tbody>
              </table>
           
           </div>
       <div style="background:black;background-color:#3361bc;margin:0px auto;border-radius:5px;max-width:800px">
          <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%;border-radius:5px">
             <tbody>
                <tr>
                   <td style="direction:ltr;font-size:0px;padding:8px 0;text-align:center">
                      <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                         <table border="0" cellpadding="0" cellspacing="0" style="vertical-align:top" width="100%">
                            <tbody>
                               <tr>
                                  <td align="center" style="font-size:0px;padding:0px 25px 0px 25px;word-break:break-word">
                                     <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px">
                                        <tbody>
                                           <tr>
                                              <td style="width:126px">
                                                 <img height="auto" src="https://espsofttech.tech/free-crypto-swapping-admin/static/icon/Crypto_Swap_icon.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px" width="150"  class="CToWUd">
                                              </td>
                                           </tr>
                                        </tbody>
                                     </table>
                                  </td>
                               </tr>
                            </tbody>
                         </table>
                      </div>
                   </td>
                </tr>
             </tbody>
          </table>
       </div>
           <div style="height:20px">
              &nbsp;
           </div>
           <div style="background:#fff;margin:0px auto;border-radius:5px;max-width:800px">
              <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%;border-radius:5px">
                 <tbody>
                    <tr>
                       <td style="direction:ltr;font-size:0px;padding:0px;text-align:center">
                          <div style="margin:0px auto;max-width:800px">
                             <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%">
                                <tbody>
                                   <tr>
                                      <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">
                                         <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                                            <table border="0" cellpadding="0" cellspacing="0" style="vertical-align:top" width="100%">
                 <tbody>
                    <tr>
                       <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
                          <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1;text-align:left;color:#000"><b>Dear ${mailObject.name?mailObject.name:mailObject.email} </b></div>
                       </td>
                    </tr>
                    <tr>
                       <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
                          ${mailObject.text}
                       </td>
                    </tr>
                    <tr>
                       <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
                          <div style="font-family:Arial,sans-serif;font-size:15px;line-height:25px;text-align:left;color:#000">
                            Thanks <br>
                            Free-crypto-swapping Team
                          </div>
                       </td>
                    </tr>
                    
                 </tbody>
                </table>
                                         </div>
                                      </td>
                                   </tr>
                                </tbody>
                             </table>
                          </div>
                       </td>
                    </tr>
                 </tbody>
              </table>
           </div>
           <div style="height:20px">
              &nbsp;
           </div>
           <div style="background:#000;background-color:#000;margin:0px auto;border-radius:5px;max-width:800px">
              <font color="#888888">
                    </font><font color="#888888">
                 </font><font color="#888888">
              </font><table align="center" border="0" cellpadding="0" cellspacing="0" style="background:#b09af7;background-color:#000;width:100%;border-radius:5px">
                 <tbody>
                    <tr>
                       <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">
                          <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
                             <font color="#888888">
                                   </font><font color="#888888">
                                </font><font color="#888888">
                             </font><table border="0" cellpadding="0" cellspacing="0" style="vertical-align:top" width="100%">
                                <tbody>
                                   <tr>
                                      <td align="center" style="font-size:0px;padding:0px 25px;word-break:break-word">
                                         <div style="font-family:Arial,sans-serif;font-size:13px;line-height:25px;text-align:left;color:#fff"><b>Free-crypto-swapping Team

                                         </b></div>
                                      </td>
                                      <td align="center" style="font-size:0px;padding:0px 25px;word-break:break-word">
                                         <div style="font-family:Arial,sans-serif;font-size:13px;line-height:25px;text-align:right;color:#fff"><b style="color:white"><a href="mailto:developer@espsofttechnologies.com" target="_blank">developer@espsofttechnologies.com</a></b></div><font color="#888888">
                                      </font></td></tr></tbody></table><font color="#888888">
                          </font></div><font color="#888888">
                       </font></td></tr></tbody></table><font color="#888888">
           </font></div><font color="#888888">
        </font></div><font color="#888888">
     </font></div>`

   }

 //  console.log('mailOptions',mailOptions)
   transporter.sendMail(mailOptions,(err,info)=>{
      if(err) {
         console.log(err)
      }else{
         console.log('message info',info)
      }
   })
}

module.exports = sendNotification