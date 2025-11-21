import { Instagram, Link2Icon, Linkedin } from 'lucide-react';
import Link from 'next/link';
const Page = () => {
  return (
    <section>
      <div className='p-4 flex justify-center items-center'>
        <Link className='p-2 border border-black/30 rounded-md text-neutral-500 ' href={'/'}>Back To Home</Link>
      </div>
      <Head />
    </section>
  );
}

export default Page;


function Head() {
  return (
    <div className='sticky top-0 bg-gray-100 h-screen w-full flex justify-center items-center'>
      <div>
        <p className='bg-gradient-to-r from-red-500 to-pink-500 
        bg-clip-text text-transparent
        animate-gradient-move text-2xl md:text-4xl font-bold'>Developed by </p>
        <h1
          className='
        text-4xl md:text-9xl font-bold tracking-tight 
        bg-gradient-to-r from-neutral-500 to-gray-600 
        bg-clip-text text-transparent
        animate-gradient-move
      '
        >
          Azimuddeen Khan <span className='text-orange-400 animate-pulse'>.</span>
        </h1>
        <div className='flex gap-3 items-center'>
          <a className='text-red-400 border border-black/30 p-2 rounded-md shadow-md' target='_blank' href={'https://www.instagram.com/everazim.2?igsh=MTk5N2sxb3ZtZmVveQ%3D%3D&utm_source=qr'}>
            <Instagram />
          </a>
          <a className='text-blue-400 border border-black/30 p-2 rounded-md shadow-md' target='_blank' href={'https://www.linkedin.com/in/azimuddeen-khan?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'}>
            <Linkedin />
          </a>
          <a className='text-blue-600 border border-black/30 p-2 rounded-md shadow-md' href='https://everazim.online/about' target='_blank' ><Link2Icon/></a>
        </div>
      </div>
    </div>

  );
}

