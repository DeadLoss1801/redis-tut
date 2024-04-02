import { Request, Response } from "express";
import User from "../models/userModel";
import { client } from "../config/connect";
import Joi from "joi";

import Redis from "ioredis";
const redis = new Redis();

export async function createUser(req: Request, res: Response): Promise<any> {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    });

    // Validate request payload
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = new User(value);
    await user.save();
    res.set("X-Cached", "false"); // Set X-Cached header to indicate response is not cached
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

export async function getUserById(req: Request, res: Response): Promise<any> {
  try {
    const userId = req.params.id;

    // const cachedUser = await getFromCache(JSON.stringify(userId));

    const cachedUser = await redis.get(JSON.stringify(userId));

    // User not found in cache, fetch from database
    const user = await User.findById(userId);
    if (cachedUser) {
      // User found in cache, return cached data
      console.log("Cached: true"); // Log cached true
      return res.status(200).send(JSON.parse(cachedUser));
    }
    if (!user) {
      return res.status(404).send("User not found");
    }

    // // Cache the fetched user data
    // await setToCache(JSON.stringify(userId), JSON.stringify(user), 86400); // 24 hours expiration
    await redis.set(JSON.stringify(userId), JSON.stringify(user), "EX", 3600);

    console.log("Cached: false"); // Log cached false
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

async function getFromCache(key: string): Promise<string | null> {
  try {
    const data = await client.get(key);
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function setToCache(
  key: string,
  value: string,
  ttl: number
): Promise<string> {
  try {
    const reply = await client.setEx(key, ttl, value);
    console.log("KKK");
    return reply;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
