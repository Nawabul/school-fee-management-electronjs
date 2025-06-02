
 export type successResponse<T> = {
    success:Boolean,
    data:T,
    message?:String,
    status?:number
  }

  export type errorResponse = {
    success:Boolean,
    message:String,
    server_error?:any,
    status:number
  }
export function apiSuccess<T>(data:T,message="Success",status=200):successResponse<T> {

  const response = {
    success: true,
    data,
    message,
    status
  } as successResponse<T>

  return response

}

export function apiError(message:String,server_error:any=null,status=404):errorResponse {

  const response = {
    success: false,
    message,
    status
  } as errorResponse

  if( server_error ) {
    response.server_error = server_error.message
  }

  return response
}
