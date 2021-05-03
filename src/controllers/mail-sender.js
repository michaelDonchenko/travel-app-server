const { MJ1, MJ2 } = require('../constants')
const mailjet = require('node-mailjet').connect(MJ1, MJ2)

exports.sendMail = async () => {
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'mikedev.media@gmail.com',
          Name: 'Mike',
        },
        To: [
          {
            Email: 'mikedev.media@gmail.com',
            Name: 'mike',
          },
        ],
        Subject: 'Greetings from Mailjet.',
        TextPart: 'My first Mailjet email',
        HTMLPart:
          "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
        CustomID: 'AppGettingStartedTest',
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
