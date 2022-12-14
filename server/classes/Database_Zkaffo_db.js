// Import Sequelize
import Sequelize from "sequelize";
import InitSchema from "../models/schema_zkaffo_db";
import UserModel from "../models/Zkaffo_db/UserModel";

// Logging
import Logger from "./Logger";
// Properties
import properties from "../properties.js";

class Database {
  constructor() {}

  /**
   * Init database
   */
  async init() {
    await this.authenticate();
    Logger.info(
      "Database connected at: " +
        properties.zkaffo_db.host +
        ":" +
        properties.zkaffo_db.port +
        "//" +
        properties.zkaffo_db.user +
        "@" +
        properties.zkaffo_db.name
    );

    // Import schema
    InitSchema();

    await UserModel.createAdminUser();

  }

  /**
   * Start database connection
   */
  async authenticate() {
    Logger.info("Authenticating to the databases...");

    const sequelize = new Sequelize(
      properties.zkaffo_db.name,
      properties.zkaffo_db.user,
      properties.zkaffo_db.password,
      {
        host: properties.zkaffo_db.host,
        dialect: properties.zkaffo_db.dialect,
        port: properties.zkaffo_db.port,
        logging: false
      }
    );
    this.dbConnection_zkaffo_db = sequelize;

    try {
      await sequelize.sync();
    } catch (err) {
      // Catch error here
      Logger.error(`Failed connection to the DB`);
      Logger.error(err);
      await new Promise(resolve => setTimeout(resolve, 5000));
      await this.authenticate();
    }
  }

  /**
   * Get connection db
   */
  getConnection() {
    return this.dbConnection_zkaffo_db;
  }
}

export default new Database();
