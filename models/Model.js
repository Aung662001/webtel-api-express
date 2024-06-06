const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Floors = sequelize.define('Floors', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  // Other model options go here
  tableName:"floors",
});

const Orders = sequelize.define('Orders', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    table_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    qty:{
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    smallest_qty:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    unit_type:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price:{
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    amount:{
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    remark:{
        type: DataTypes.TEXT(1000),
        allowNull: false
    },
    paid:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    printed:{
        type: DataTypes.TINYINT,
        allowNull: false
    },
    discount:{
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    foc:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
  }, {
    // Other model options go here
    tableName:"order_details",
  });