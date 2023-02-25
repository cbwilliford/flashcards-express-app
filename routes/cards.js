const express = require('express')
const router = express.Router();
const { data } = require('../data/flashcardData.json')
const { cards } = data;

const getNewCard = (req, res) => {
  try {
  const newCard = Math.floor(Math.random() * cards.length)
  const referrer = req.get('referrer')
  if (!referrer) return res.redirect(`/cards/${newCard}`)
  if (!referrer.match(/\/cards\/(\d+)/)) return res.redirect(`/cards/${newCard}`)
  const prevCard = Number(referrer.match(/\/cards\/(\d+)/)[1])
  if(prevCard !== newCard) {
    return res.redirect(`/cards/${newCard}`)
  } else {
    return getNewCard(req, res);
  }
} catch(err) {
  console.error(err)
}
}


router.get('/', (req, res) => {
  return getNewCard(req, res);
});


router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const { side } = req.query;
  if(isNaN(Number(id))) next();
  if (!side || side !== 'question' && side !== 'answer'){
    return res.redirect(`/cards/${id}?side=question`)
  }
  const name = req.cookies.username;
  const text = cards[id][side];
  const hint = side === 'question' ? cards[id].hint : null;
  const otherSide = side === 'question' ? 'answer' : 'question'
  const templateData = { text, hint, side, otherSide, id, name}
  res.render(`cards`, templateData)
});

module.exports = router;
