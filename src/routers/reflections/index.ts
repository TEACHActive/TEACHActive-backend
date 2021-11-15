import express from "express";

import { Response } from "../types";
import {
  createReflectionSectionsForSession,
  deleteReflectionSectionsForSession,
  getReflectionSectionsForSession,
  updateReflectionSectionsForSession,
} from "./controller";
import { authenticateToken, checkIfUserOwnsSession } from "../middleware";
import { TokenSign } from "../user/types";

const router = express.Router();
router.use(authenticateToken);
router.use(checkIfUserOwnsSession);

/**
 * Get Reflections for session
 */
const getReflectionsForSessionEndpoint = `/:sessionId`;
router.get(getReflectionsForSessionEndpoint, async (req, res) => {
  const { sessionId } = req.params;
  let response;
  const tokenSign: TokenSign = req.user;

  try {
    response = await getReflectionSectionsForSession(sessionId, tokenSign);
  } catch (error) {
    console.error(error);
    response = new Response(
      false,
      null,
      500,
      "Server error when getting reflection sections"
    );
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

/**
 * Get Reflections for session
 */
const createReflectionsForSessionEndpoint = `/:sessionId`;
router.post(createReflectionsForSessionEndpoint, async (req, res) => {
  const { sessionId } = req.params;
  let response;
  const tokenSign: TokenSign = req.user;

  try {
    response = await createReflectionSectionsForSession(sessionId, tokenSign);
  } catch (error) {
    console.error(error);
    response = new Response(
      false,
      null,
      500,
      "Server error when creating reflection sections"
    );
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

/**
 * Update Reflections for session
 */
const updateReflectionsForSessionEndpoint = `/:sessionId`;
router.put(updateReflectionsForSessionEndpoint, async (req, res) => {
  const { sessionId } = req.params;
  let response;
  const tokenSign: TokenSign = req.user;

  try {
    response = await updateReflectionSectionsForSession(
      sessionId,
      tokenSign,
      req.body
    );
  } catch (error) {
    console.error(error);

    response = new Response(
      false,
      null,
      500,
      "Server error when updating reflection sections"
    );
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

/**
 * Delete Reflections for session
 */
const deleteReflectionsForSessionEndpoint = `/:sessionId`;
router.delete(deleteReflectionsForSessionEndpoint, async (req, res) => {
  const { sessionId } = req.params;
  let response;
  const tokenSign: TokenSign = req.user;

  try {
    response = await deleteReflectionSectionsForSession(sessionId, tokenSign);
  } catch (error) {
    console.error(error);
    response = new Response(
      false,
      null,
      500,
      "Server error when deleting reflection sections"
    );
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

const baseEndpoint = "/reflections";
export { router, baseEndpoint };
