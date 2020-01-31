import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      street_number: Yup.number()
        .required()
        .positive(),
      street_data: Yup.string(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      zipcode: Yup.string()
        .length(8)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({
        error: 'Falha na validação dos dados fornecidos do destinatário!',
      });
    }

    const recipientExists = await Recipient.findOne({
      where: {
        name: req.body.name,
        street: req.body.street,
        street_number: req.body.street_number,
        city: req.body.city,
        state: req.body.state,
      },
    });

    if (recipientExists) {
      return res.status(400).json({ error: 'Destinatário já existe!' });
    }

    const recipient = JSON.parse(req.body);

    const { name, street, street_number, city, state } = await Recipient.create(
      recipient
    );
    return res.json({ name, street, street_number, city, state });
  }

  async update(req, res) {}
}

export default new RecipientController();