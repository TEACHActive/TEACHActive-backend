import { Response } from "../types";
import { TokenSign } from "../user/types";
import { baseReflectionSections } from "./baseReflectionSections";
import {
  Better_ReflectionsModel,
  ReflectionQuestion,
  ReflectionSection,
} from "../../models/reflectionsModel";

export const getReflectionSectionsForSession = async (
  sessionId: string,
  tokenSign: TokenSign
): Promise<Response<any | null>> => {
  const matchingReflection = await Better_ReflectionsModel.findOne({
    userId: tokenSign.uid,
    sessionId: sessionId,
  });

  if (!matchingReflection) {
    const errorMsg = `Matching reflection section not found for user`;
    console.error(errorMsg);
    return new Response(false, null, 404, errorMsg);
  }

  return new Response(true, matchingReflection);
};

export const createReflectionSectionsForSession = async (
  sessionId: string,
  tokenSign: TokenSign
): Promise<Response<any | null>> => {
  const newReflection = new Better_ReflectionsModel({
    userId: tokenSign.uid,
    sessionId: sessionId,
    reflectionSections: baseReflectionSections,
  });

  const savedReflection = await newReflection.save();

  return new Response(true, savedReflection, 201);
};

export const updateReflectionSectionsForSession = async (
  sessionId: string,
  tokenSign: TokenSign,
  incomingReflectionSections: any
): Promise<Response<any | null>> => {
  let updatedReflectionSections: ReflectionSection[] = [
    ...baseReflectionSections,
  ].map((section) => {
    const updatedQuestions = section.questions.map((reflectionQuestion) => {
      const updatingR: ReflectionQuestion = incomingReflectionSections.find(
        (incomingReflection: ReflectionQuestion) =>
          incomingReflection.id === reflectionQuestion.id
      );
      return updatingR ?? reflectionQuestion;
    });
    section.questions = updatedQuestions;
    return section;
  });

  const matchingReflection = await Better_ReflectionsModel.findOne({
    userId: tokenSign.uid,
    sessionId: sessionId,
  });

  if (!matchingReflection) {
    return new Response(false, null, 404, "Matching reflection doc not found");
  }

  matchingReflection.reflectionSections = updatedReflectionSections;

  const updatedReflection = await Better_ReflectionsModel.findOneAndUpdate(
    {
      userId: tokenSign.uid,
      sessionId: sessionId,
    },
    {
      $set: {
        reflectionSections: updatedReflectionSections,
      },
    },
    { new: true },
    (err, doc, raw) => {
      console.log(err);

      // if (err) {
      //   //Try creating a new one since it presumable cant be found
      // }
    }
  );

  return new Response(true, updatedReflection);
};

export const deleteReflectionSectionsForSession = async (
  sessionId: string,
  tokenSign: TokenSign
): Promise<Response<any | null>> => {
  const matchingReflection = await Better_ReflectionsModel.findOneAndDelete({
    userId: tokenSign.uid,
    sessionId: sessionId,
  });

  if (!matchingReflection) {
    const errorMsg = `Matching reflection section not found for user`;
    console.error(errorMsg);
    return new Response(false, null, 404, errorMsg);
  }

  return new Response(true, matchingReflection);
};
