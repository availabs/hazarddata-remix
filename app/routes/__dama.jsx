import {
  Outlet,
  NavLink,
  useLoaderData
} from "@remix-run/react";

import { checkAuth } from "~/utils/session.server";

import AuthMenu from '~/modules/auth/AuthMenu'

export async function loader ({ request }) {
  return await checkAuth(request)
}

export default function Index() {
  const user = useLoaderData()
  return (
    <div className={''}>
      <div className='bg-gray-100 p-1 text-gray-500 min-h-screen'>
        <div className='flex p-1 text-gray-800 border-b w-full'>
          <NavLink to='/' className='p-4'>Home</NavLink>
          <div className='flex flex-1 justify-end '>
            <div>
              <AuthMenu 
                user={user} 
                items={[{
                  to: '/source/create',
                  text: 'New Data Source',
                  icon: 'fa fa-database'
                }]}
              />
            </div>
          </div>
        </div>
        <div className='max-w-5xl mx-auto'>
          <div className='w-full border-b p-2'>breadcrumbs</div>
          <Outlet context={{user}}/>
        </div>
      </div>
    </div>
  );
}
