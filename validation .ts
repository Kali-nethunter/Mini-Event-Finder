import Joi from 'joi';

export const eventValidation = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().max(1000).required(),
  location: Joi.object({
    name: Joi.string().required(),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required()
    }).required()
  }).required(),
  date: Joi.date().greater('now').required(),
  maxParticipants: Joi.number().min(1).max(10000).required(),
  category: Joi.string().valid(
    'Music', 'Sports', 'Tech', 'Art', 'Food', 'Business', 'Education', 'Other'
  ).required(),
  imageUrl: Joi.string().uri(),
  organizer: Joi.string().required(),
  tags: Joi.array().items(Joi.string())
});