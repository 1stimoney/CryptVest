import About from '@/components/About'
import Intro from '@/components/Intro'

export default function Home() {
  return (
    <div>
      <Intro />
      <div className='mt-[-20vh]'>
        <About />
      </div>
    </div>
  )
}
