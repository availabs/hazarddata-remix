import { redirect } from "@remix-run/node";

import { logout } from "~/utils/session.server";

export const action = async ({
  request,
}) => {
  //console.log('action')  
  return logout(request);
 };

export const loader = async ({request}) => {
  console.log('loader')
  //const pathname = new URL(request.url).pathname
  //logout(request);
  return redirect("/");
};