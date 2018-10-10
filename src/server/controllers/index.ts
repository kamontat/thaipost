import { Tracking } from "../../lib/apis";

import { Request, Response } from "express";

export const root = (_: Request, res: Response) => {
  return res.json({
    header: "Welcome to unoffical APIs for Thailand Post Office.",
    description: "This APIs made from headless chrome with express as server management."
  });
};

export const tracking = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      res.status(400);
      return res.json({ error: true, message: "ID is required" });
    }
    const result = await Tracking(req.params.id);
    res.header("Content-Type", "application/json");
    if (req.query && req.query.format === "true") {
      return res.send(
        JSON.stringify(
          {
            id: req.params.id,
            result: result
          },
          undefined,
          " "
        )
      );
    }
    return res.json({
      id: req.params.id,
      result: result
    });
  } catch (e) {
    res.status(400);
    res.json({ error: true, message: e.message });
  }
};
