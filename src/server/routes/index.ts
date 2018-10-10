import { root, tracking } from "../controllers";

export default {
  routes: [
    {
      path: "/",
      controller: root
    },
    {
      path: "/tracking/:id",
      controller: tracking
    }
  ]
};
