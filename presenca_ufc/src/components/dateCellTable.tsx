'use client'

import { Th } from "@chakra-ui/react"
import { dateFormat } from "@/utils/dateFormater"

type CellTable = {
  date: string
}
export function DateCellTable({ date }: CellTable) {
  return (
    <Th
      fontSize='10px'
      textAlign='center'
      px={1}
      minW='40px'
      maxW='60px'
    >
      {dateFormat(date)}
    </Th>
  )
}