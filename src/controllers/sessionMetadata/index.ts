import express from "express";
import { Response } from "../types";
import {
  getPerformanceBySessionId,
  updateNameBySessionId,
  updatePerformanceBySessionId,
} from "./controller";

const app = express();
const baseEndpoint = "/metadata";

/**
 * Test Endpoint
 */
app.get(`${baseEndpoint}`, async function (req, res) {
  res.end("Hello metadata");
});

/**
 * Get Performance by sessionId
 */
const getPerformanceBySessionIdEndpoint = `${baseEndpoint}/performance/:sessionId`;
app.get(getPerformanceBySessionIdEndpoint, async function (req, res) {
  const { sessionId } = req.params;

  let response;

  try {
    response = await getPerformanceBySessionId(sessionId);
  } catch (error) {
    response = new Response(
      false,
      null,
      500,
      "Server error when getting performance"
    );
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

/**
 * Set Performance by sessionId
 */
const updatePerformanceBySessionIdEndpoint = `${baseEndpoint}/performance/:sessionId`;
app.put(updatePerformanceBySessionIdEndpoint, async function (req, res) {
  const { sessionId } = req.params;
  const { performance } = req.body;

  let response;

  try {
    response = await updatePerformanceBySessionId(sessionId, performance);
  } catch (error: any) {
    response = new Response(
      false,
      null,
      500,
      "Server error when getting performance",
      error.toString()
    );
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

/**
 * Set Name by sessionId
 */
const updateNameBySessionIdEndpoint = `${baseEndpoint}/name/:sessionId`;
app.put(updateNameBySessionIdEndpoint, async function (req, res) {
  const { sessionId } = req.params;
  const { name } = req.body;

  let response;

  try {
    response = await updateNameBySessionId(sessionId, name);
  } catch (error) {
    response = new Response(
      false,
      null,
      500,
      "Server error when getting performance"
    );
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

export { app as metadata };
