"use client"
import { getShapeStream, useShape } from "@electric-sql/react"
import { addEvent } from "./actions"
export default function Home() {
  const { data } = useShape<{id: string, access_type: string}>({
    url: `http://localhost:3000/v1/shape/event`,
    // where: `status='draft'`
    // where: `access_type='private'`
    // where: `event_id='krj0hd8tszf7i2c'`
    where: `type='image'`
    // where: `type='image' AND access_type='public'`
  })

  const  {isUpToDate} = getShapeStream({ url: `http://localhost:3000/v1/shape/event`,
    // where: `status='draft'`
    // where: `access_type='private'`
    // where: `event_id='krj0hd8tszf7i2c'`
    where: `type='image'` })

    if (!isUpToDate) {
      return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
            <div>Loading...</div>
            </main>
        </div>
      )
    }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <button onClick={() => addEvent()}>Add dummy</button>
      <div>
        {data?.map(foo => <div className="flex flex-row gap-3" key={foo.id}>
          <p>{foo.id}</p>
          <p>{foo.access_type}</p>
          </div>)}
      </div>
      </main>
    </div>
  );
}
