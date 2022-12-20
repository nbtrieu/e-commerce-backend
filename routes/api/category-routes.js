const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    console.log('GETTING all categories with associated products...');
    const categoriesData = await Category.findAll({ include: [Product] });
    res.status(200).json(categoriesData);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    console.log('GETTING the category with the requested id...');
    const categoriesData = await Category.findByPk(req.params.id, {
      include: [Product]
    });

    if (!categoriesData) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    };

    res.status(200).json(categoriesData);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    console.log('CREATING a new category...');
    const categoriesData = await Category.create(req.body);
    res.status(200).json(categoriesData);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    console.log('UPDATING the category with the requested id...');
    const categoriesData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!categoriesData) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    };

    res.status(200).json(categoriesData);
  } catch (error) {
    res.status(400).json(error);
  };
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    console.log('DELETING the category with the requested id...');
    const categoriesData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!categoriesData) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    };

    res.status(200).json(categoriesData);
  } catch (error) {
    res.status(500).json(error);
  };
});

module.exports = router;
