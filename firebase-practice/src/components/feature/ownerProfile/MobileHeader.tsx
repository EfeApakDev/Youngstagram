import { authService } from "@FireBase"
import ProfileEditModal from "@share/Modal/profile/ProfileEditModal"
import Image from "next/image"
import { SetStateAction, useState } from "react"
import styled from "styled-components"
import { CustomH2Light, CustomH4, CustomH4Light, FlexBox, Margin } from "ui"

type Props = {
  imageDataLength: number
  privateImageDataLength: number
  setPickImageData: React.Dispatch<SetStateAction<"all" | "public" | "private">>
  pickImageData: "all" | "public" | "private"
}

const Style = {
  ProfileWrapper: styled.div`
    width: 95%;
    height: 120px;
    border-bottom: 1px solid lightgrey;
  `,
  ProfileImage: styled.img`
    width: 90px;
    height: 90px;
    border-radius: 100px;
  `,
  ProfileEditButton: styled.div`
    width: 250px;
    height: 40px;
    -webkit-appearance: none;
    border: 2px solid lightgrey;
    border-radius: 10px;
    background-color: withe;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    cursor: pointer;
  `,
  ProfileInfoWrapper: styled.div`
    width: 100%;
    height: 70px;
    border-bottom: 1px solid lightgrey;
    display: flex;
    justify-content: space-between;
  `,
  SortToPublic: styled.div`
    cursor: pointer;
    width: 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    border-bottom: 3px solid
      ${(props) => (props.about === "public" ? "grey" : "none")};
  `,
  SortToPrivate: styled.div`
    cursor: pointer;
    width: 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    border-bottom: 3px solid
      ${(props) => (props.about === "private" ? "grey" : "none")};
  `,
  SortToAll: styled.div`
    cursor: pointer;
    width: 33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    border-bottom: 3px solid
      ${(props) => (props.about === "all" ? "grey" : "none")};
  `,
}

export default function MobileHeader({
  imageDataLength,
  privateImageDataLength,
  setPickImageData,
  pickImageData,
}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <>
      <ProfileEditModal isPC={false} isOpen={isOpen} setIsOpen={setIsOpen} />

      <Style.ProfileWrapper>
        <FlexBox width={"100%"}>
          <Image
            src={
              authService.currentUser?.photoURL
                ? `${authService.currentUser?.photoURL}`
                : "/profile.svg"
            }
            alt="profile"
            width={90}
            height={90}
            style={
              authService.currentUser?.photoURL
                ? { borderRadius: "100px" }
                : { borderRadius: "none" }
            }
          />
          <Margin direction="row" size={15} />
          <FlexBox column={true} width="fit-content">
            <CustomH2Light>
              {authService.currentUser?.displayName}
            </CustomH2Light>
            <Margin direction="column" size={13} />

            <Style.ProfileEditButton
              onClick={() => {
                setIsOpen(true)
              }}
            >
              프로필 편집
            </Style.ProfileEditButton>
          </FlexBox>
        </FlexBox>
      </Style.ProfileWrapper>
      <Margin direction="column" size={15} />
      <Style.ProfileInfoWrapper>
        <Style.SortToAll
          onClick={() => {
            setPickImageData("all")
          }}
          about={pickImageData}
        >
          <CustomH4Light>전체 게시물</CustomH4Light>
          <CustomH4Light>{imageDataLength}</CustomH4Light>
        </Style.SortToAll>
        <Style.SortToPublic
          onClick={() => {
            setPickImageData("public")
          }}
          about={pickImageData}
        >
          <CustomH4Light>공개 게시물</CustomH4Light>
          <CustomH4Light>
            {imageDataLength - privateImageDataLength}
          </CustomH4Light>
        </Style.SortToPublic>
        <Style.SortToPrivate
          onClick={() => {
            setPickImageData("private")
          }}
          about={pickImageData}
        >
          <CustomH4Light>비공개 게시물</CustomH4Light>
          <CustomH4Light>{privateImageDataLength}</CustomH4Light>
        </Style.SortToPrivate>
      </Style.ProfileInfoWrapper>
    </>
  )
}
