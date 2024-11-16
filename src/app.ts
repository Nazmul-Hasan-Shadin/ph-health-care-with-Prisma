import express, {
  Application,
  NextFunction,
  Request,
  Response,
  request,
} from "express";
import cors from "cors";
import { userRoutes } from "./app/modules/User/user.route";
import exp from "constants";
import { adminRoutes } from "./app/modules/Admin/admin.route";
import router from "./app/routes";
import globlaErrorHandler from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(cors());
//  parser
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "ph health care server",
  });
});

app.use("/api/v1", router);

app.use(globlaErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    succss: false,
    message: "route not found bro",
    error: {
      path: req.originalUrl,
      message: "your requested path is not found",
    },
  });
});

export default app;
