const express = require("express");
const whatsapp = require("./config/whatsapp");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const { z } = require("zod");
const messageScema = z.object({
  phone: z.string().regex(/^628\d{6,11}$/, {
    message: "Phone number must start with 628 and followed by 6-11 digits.",
  }),
  message: z.string().min(1),
});

app.post('/send-message', async (req, res) => {
    const { phone, message } = messageScema.parse(req.body);
    try {
      await whatsapp.sendMessage(`${phone}@c.us`, message);
    } catch (e) {
      return responseError(res, 400, 'Failed to send message');
    }

    return res.json({ message: 'Message sent' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
