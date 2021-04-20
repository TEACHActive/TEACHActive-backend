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
  console.log(`${baseEndpoint}`);
  res.end("Hello metadata");
});

/**
 * Get Performance by sessionId
 */
const getPerformanceBySessionIdEndpoint = `${baseEndpoint}/preformance/:sessionId`;
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
const updatePerformanceBySessionIdEndpoint = `${baseEndpoint}/preformance/:sessionId`;
app.put(updatePerformanceBySessionIdEndpoint, async function (req, res) {
  const { sessionId } = req.params;
  const { preformance } = req.body;

  let response;

  try {
    response = await updatePerformanceBySessionId(sessionId, preformance);
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
