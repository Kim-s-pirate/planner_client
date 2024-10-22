import {
  CloseButton,
  InputContainer,
  Line,
  ModalButton,
  ModalButtonContainer,
  ModalContainer,
  ModalContent,
  ModalInput,
  ModalLayout,
  ProgressContainer,
} from '@components/Library/LibraryModal/LibraryEditModal/LibraryEditModal.style'
import workBookContentStore from '@stores/workBookContentStore'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import { useEffect, useRef, useState } from 'react'
import { Bar } from 'react-chartjs-2'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

export default function LibraryEditModal({ workbook, onClose, workbookIndex }) {
  const updateWorkbook = workBookContentStore((state) => state.updateWorkbook)
  const removeWorkbook = workBookContentStore((state) => state.removeWorkbook)
  const [updatedName, setUpdatedName] = useState('')
  const [updatedSubject, setUpdatedSubject] = useState('')
  const nameInputRef = useRef(null)
  const subjectInputRef = useRef(null)

  useEffect(() => {
    if (workbook) {
      setUpdatedName(workbook.name || '')
      setUpdatedSubject(workbook.subject || '')
    }
  }, [workbook])

  const handleWorkBookUpdate = () => {
    updateWorkbook(workbookIndex, {
      ...workbook,
      name: updatedName,
      subject: updatedSubject,
    })
    onClose()
  }

  const handleWorkBookDelete = () => {
    removeWorkbook(workbookIndex)
    onClose()
  }

  const handleKeyDown = (e, ref) => {
    if (e.key === 'Enter') {
      ref.current.blur() // Enter 키를 누르면 해당 input의 포커스 해제
    }
  }

  const data = {
    labels: [workbook.date], // X축 레이블
    datasets: [
      {
        label: '주간 진행률',
        data: [workbook.progress], // Y축 데이터, 처음엔 하나만
        backgroundColor: '#ff6b6b', // 막대 색상
      },
    ],
  }

  const options = {
    responsive: true, // 반응형 설정
    maintainAspectRatio: false, // 가로 세로 비율 유지 해제
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // X축 격자선 제거
        },
      },
      y: {
        ticks: {
          beginAtZero: true, // Y축이 0부터 시작하도록 설정
        },
      },
    },
    barThickness: 20, // 막대 두께 설정
  }

  return (
    <ModalContainer>
      <ModalLayout>
        <CloseButton onClick={onClose}>×</CloseButton>
        <ModalContent>
          <ProgressContainer>
            {/* 성취도 표시 */}
            <CircularProgressbar
              value={workbook.progress}
              text={`${workbook.progress}%`}
              styles={buildStyles({
                pathColor: '#ff6b6b', // 진행도 색상
                textColor: '#000',
                trailColor: '#d6d6d6', // 남은 진행도 색상
                textSize: '1.5rem',
              })}
            />
          </ProgressContainer>
          <InputContainer>
            <ModalInput
              type="text"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, nameInputRef)}
              placeholder="문제집 이름을 입력하세요"
              ref={nameInputRef}
            />
            <ModalInput
              type="text"
              value={updatedSubject}
              onChange={(e) => setUpdatedSubject(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, subjectInputRef)}
              placeholder="과목 이름을 입력하세요"
              ref={subjectInputRef}
            />
          </InputContainer>
        </ModalContent>
        <Line />
        <div style={{ width: '100%', height: '300px' }}>
          <Bar data={data} options={options} />
        </div>
        <ModalButtonContainer>
          <ModalButton onClick={handleWorkBookUpdate}>수정완료</ModalButton>
          <ModalButton
            onClick={handleWorkBookDelete}
            style={{ backgroundColor: 'red' }}
          >
            삭제
          </ModalButton>
        </ModalButtonContainer>
      </ModalLayout>
    </ModalContainer>
  )
}