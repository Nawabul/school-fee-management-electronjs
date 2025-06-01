import {Class as ClassTS} from "../../types/interfaces/class"
import {successResponse, errorResponse, apiSuccess, apiError} from "../../types/utils/apiReturn";
import ClassService from "../service/ClassService";

class ClassController {

 async create(_,data: ClassTS):Promise<successResponse<number>|errorResponse> {

    try {


      const result:number = await ClassService.create(data);

      return apiSuccess(result,"Class created successfully")
    } catch (error) {
      return apiError("Error while creating class")
    }
  }
}


export default new ClassController();
