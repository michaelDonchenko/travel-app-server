const { MJ1, MJ2 } = require('../constants')
const mailjet = require('node-mailjet').connect(MJ1, MJ2)

exports.sendMail = async (
  email,
  name,
  subject,
  textPart,
  htmlPart,
  costumId
) => {
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'mikesblogapp@gmail.com',
          Name: 'Mike',
        },
        To: [
          {
            Email: email,
            Name: name,
          },
        ],
        Subject: subject,
        TextPart: textPart,
        HTMLPart: htmlPart,
        CustomID: costumId,
      },
    ],
  })
  request
    .then((result) => {
      console.log('Mail sent succefully')
    })
    .catch((err) => {
      console.log(err.statusCode)
    })
}
