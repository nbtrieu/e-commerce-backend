const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    console.log('GETTING all tags with associated product data...');
    const tagsData = await Tag.findAll({ 
      // The include option can receive an ARRAY in order to fetch multiple associated models at once
      include: [
        { 
          model: Product, 
          through: ProductTag,
          // as: 'product_tags', (ALTERNATIVE)
        },
      ],
    });
    res.status(200).json(tagsData);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    console.log('GETTING the requested tag with associated product data...');
    const tagsData = await Tag.findByPk(req.params.id, { 
      include: [
        { 
          model: Product, 
          through: ProductTag, 
          // as: 'product_tags', (ALTERNATIVE: use alias)
        },
      ],
    });

    if (!tagsData) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    };

    res.status(200).json(tagsData);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    console.log('CREATING a new tag...');
    const tagsData = await Tag.create(req.body);
    res.status(200).json(tagsData);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    console.log('UPDATING the tag with the requested id...');
    const tagsData = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!tagsData) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    };

    res.status(200).json(tagsData);
  } catch (error) {
    res.status(400).json(error);
  };
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    console.log('DELETING the tag with the requested id...');
    const tagsData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!tagsData) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    };

    res.status(200).json(tagsData);
  } catch (error) {
    res.status(500).json(error);
  };
});

module.exports = router;
