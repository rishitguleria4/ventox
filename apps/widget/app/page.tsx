import { Button } from "@workspace/ui/components/button"
import { add } from "@workspace/math/add"
export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello apps/widget</h1>
        <div className="flex gap-2">
          <Button>Button</Button>
          <p>{add (3,3)}</p>
          <Button variant="outline">Outline</Button>
        </div>
      </div>
    </div>
  )
}
