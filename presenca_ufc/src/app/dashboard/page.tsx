import dynamic from 'next/dynamic'

const DynamicClassCardList = dynamic(() => import('@/components/classCardsList'))

export default function Dashboard() {
  return (
    <DynamicClassCardList />
  )
}