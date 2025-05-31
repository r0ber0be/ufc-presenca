import { TurmaT } from "@/types/Turma";
import { Box, Card, Flex, Heading, Link as ChakraLink, Text } from "@chakra-ui/react";
import Link from "next/link"
import { memo } from "react";

const ClassCard = memo(function MemoizeCard({ turma }:{ turma: TurmaT }) {
  const { id, code, name, numberOfStudents, classBlock, classRoom, schedules, _count } = turma

  return (
    <ChakraLink as={Link} href={`/dashboard/classe/${id}`}>
      <Card maxW='100%'
        tabIndex={0}
        variant='filled'
        borderBottom='2px'
        borderColor='gray.200'
        _hover={{ 
          bgGradient: 'linear(to-r, green.200, blue.100)',
        }}
      >
        <Flex p={{ base: '12px', sm:'15px'}}>
          <Flex flex='1' gap={{ base: 'none', sm: '4' }} flexWrap='nowrap' justify='space-evenly'>
            <Box alignContent='center' maxW={{ base:'350px', '2xl': '450px' }} minW='150px' p='10px'>
              <Heading size={{ base: 'xs', md: 'sm', '2xl': 'md'}} textTransform='uppercase'>
                { name } - { code }
              </Heading>
              
              <Text pt='2' 
                align='center' 
                fontSize={{ base: 'xs', md: 'sm' }} 
                textTransform='uppercase'
              >
                Bloco {classBlock}, Sala {classRoom}
              </Text>
            </Box>

            <Box minW='100px' p='10px'>
              <Heading size='xs' textTransform='uppercase'>
                Presentes:
              </Heading>
              <Text pt='2' align='center' fontSize={{ base: 'xs', md: 'sm' }}>
                0 / { _count.enrollments }
              </Text>
            </Box>

            <Box minW='100px' p='10px'>
              <Heading size='xs' textTransform='uppercase'>
                { schedules[0].weekDay } - { schedules[1]?.weekDay || '' }
              </Heading>
              {
                schedules[0].startTime == schedules[1]?.startTime ? 
                  <Text pt='2' align='center' fontSize={{ base: 'xs', md: 'sm' }}>
                    { schedules[0].startTime } às { schedules[0].endTime }
                  </Text> 
                :
                <>
                  <Text pt='2' align='center' fontSize={{ base: 'xs', md: 'sm' }}>
                    { schedules[0].startTime } às { schedules[0].endTime }
                  </Text>
                  {
                    schedules.length > 1 ? 
                      <Text pt='2' align='center' fontSize={{ base: 'xs', md: 'sm' }}>
                        { schedules[1].startTime } às { schedules[1].endTime }
                      </Text>
                      : <></>
                  }
                </>
              }
            </Box>
          </Flex>
        </Flex>
      </Card>
    </ChakraLink>
  )
})

export default ClassCard