"use client"
import { useShape } from "@electric-sql/react"

  
export default function Home() {
  const { data,  } = useShape<{id: string}>({
    url: `http://localhost:3000/v1/shape/gallery`,
    // where: `status='draft'`
    // where: `access_type='private'`
    // where: `event_id='krj0hd8tszf7i2c'`
    where: `type='image'`
  })

  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <div>
        {data?.map(foo => <div key={foo.id}>{foo.id}</div>)}
      </div>
      </main>
    </div>
  );
}
