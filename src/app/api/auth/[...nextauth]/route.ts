import NextAuth from 'next-auth';

import { authOptions } from '#utils/helper/authHelper';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
