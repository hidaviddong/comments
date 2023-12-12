import { PlusIcon } from '@radix-ui/react-icons'
import { useAtomValue } from 'jotai'
import { LoaderIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { currentProjectAtom } from '@/store'

import { checkTooltipExist, useTooltipCreate } from '../hooks'

export default function ClientTooltip({ x, y }: { x: number; y: number }) {
  const currentProject = useAtomValue(currentProjectAtom)
  const { mutate: tooltipCreate, isPending } = useTooltipCreate()
  if (x === 0 && y === 0) {
    return <></>
  }
  async function handlePlusIconClick() {
    const tooltipExist = await checkTooltipExist({ x, y, project_id: currentProject })
    if (!tooltipExist) {
      tooltipCreate({ x, y, project_id: currentProject })
    }
  }
  if (isPending) {
    return (
      <Button size="icon" className="absolute h-6 w-6 bg-white" style={{ left: `${x}px`, top: `${y}px` }}>
        <LoaderIcon className="white h-6 w-6 animate-spin" />
      </Button>
    )
  }

  return (
    <Button variant="outline" size="icon" className="absolute h-6 w-6" style={{ left: `${x}px`, top: `${y}px` }}>
      <PlusIcon className="h-4 w-4" onClick={handlePlusIconClick} />
    </Button>
  )
}
