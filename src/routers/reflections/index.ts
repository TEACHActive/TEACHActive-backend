import express from "express";

import { Response } from "../types";
import {
  createReflectionSectionsForSession,
  deleteReflectionSectionsForSession,
  getAllReflectionSections,
  getReflectionSectionsForSession,
  updateReflectionSectionsForSession,
} from "./controller";
import {
  authenticateToken,
  checkIfUserOwnsSession,
  checkIsUserAdmin,
} from "../middleware";
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

  try {
    const _req: any = req;
    const tokenSign: TokenSign = _req.user;
    response = await getReflectionSectionsForSession(sessionId);
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
 * Get Reflections for session and create them if not existing
 */
const getReflectionForSessionUpsertEndpoint = `/upsert/:sessionId`;
router.post(getReflectionForSessionUpsertEndpoint, async (req, res) => {
  const { sessionId } = req.params;
  let response;

  try {
    const _req: any = req;
    const tokenSign: TokenSign = _req.user;
    response = await getReflectionSectionsForSession(sessionId);

    if (response.statusCode === 404) {
      response = await createReflectionSectionsForSession(sessionId, tokenSign);
    }
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

  try {
    const _req: any = req;
    const tokenSign: TokenSign = _req.user;
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

  try {
    const _req: any = req;
    const tokenSign: TokenSign = _req.user;
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

  try {
    const _req: any = req;
    const tokenSign: TokenSign = _req.user;
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

/**
 * Get Reflections for session
 */
const getAllCreatedReflectionsEndpoint = `/admin/all`;
router.get(
  getAllCreatedReflectionsEndpoint,
  checkIsUserAdmin,
  async (req, res) => {
    let response;

    try {
      response = await getAllReflectionSections();

      if (response.data)
        response.data = response.data.map(
          (reflection: any) => reflection.sessionId
        );
    } catch (error) {
      console.error(error);
      response = new Response(
        false,
        null,
        500,
        "Server error when getting reflections"
      );
    }

    res.statusCode = response.statusCode;
    res.json(response);
  }
);

const baseEndpoint = "/reflections";
export { router, baseEndpoint };
