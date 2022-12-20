const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    console.log('GETTING all products with associated category and tag data...');
    const productsData = await Product.findAll({ 
      // The include option can receive an ARRAY in order to fetch multiple associated models at once
      include: [
        Category,
        { 
          model: Tag, 
          // through: ProductTag, (ALTERNATIVE instead of using alias)
          as: 'product_tags',
        },
      ],
    });
    res.status(200).json(productsData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    console.log('GETTING the requested product with associated category and tag data...');
    const productsData = await Product.findByPk(req.params.id, { 
      include: [
        Category,
        { 
          model: Tag, 
          // through: ProductTag, (ALTERNATIVE instead of using alias)
          as: 'product_tags',
        },
      ],
    });

    if (!productsData) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    };

    res.status(200).json(productsData);
  } catch (error) {
    res.status(400).json(error);
  }
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTags = ProductTag.findAll({ where: { product_id: req.params.id } });
      
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
      };
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    console.log('DELETING the product with the requested id...');
    const productsData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!productsData) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    };

    res.status(200).json(productsData);
  } catch (error) {
    res.status(500).json(error);
  };
});

module.exports = router;
