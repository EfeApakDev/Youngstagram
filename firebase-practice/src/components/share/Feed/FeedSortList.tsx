import { userDataState } from "@share/recoil/recoilList"
import { FeedData } from "backend/dto"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import styled from "styled-components"
import { CustomH2, CustomH2Light, CustomH5Light, Margin } from "ui"
import FeedSortingCard from "./FeedSortingCard"

type Props = {
  FeedData: FeedData[]
}

const Style = {
  ImageCard: styled.div`
    width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  ImageContainer: styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 50px;
  `,
}

export default function FeedSortList({ FeedData }: Props) {
  const [feedDataSortedByUploadTime, setFeedDataSortedByUploadTime] =
    useState<FeedData[]>()
  useEffect(() => {
    if (FeedData.length === 0) setFeedDataSortedByUploadTime([])
    if (FeedData !== undefined && FeedData.length > 0)
      setFeedDataSortedByUploadTime(
        (JSON.parse(JSON.stringify(FeedData)) as FeedData[]).sort(function (
          a,
          b,
        ) {
          return Number(b.uploadTime) - Number(a.uploadTime)
        }),
      )
  }, [FeedData])
  return (
    <Style.ImageContainer>
      {feedDataSortedByUploadTime !== undefined &&
      feedDataSortedByUploadTime.length !== 0 ? (
        feedDataSortedByUploadTime.map((data, index) => {
          return <FeedSortingCard key={index} feedData={data} />
        })
      ) : (
        <>
          <Image
            src={"/camera.webp"}
            width={62}
            height={62}
            alt="camera"
            priority
            blurDataURL="/camera.webp"
            placeholder="blur"
          />
          <CustomH2Light>사진 공유</CustomH2Light>
          <CustomH5Light>
            사진을 공유하면 회원님의 프로필에 표시됩니다.
          </CustomH5Light>
        </>
      )}
    </Style.ImageContainer>
  )
}
