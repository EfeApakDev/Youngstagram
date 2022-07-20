import { arrayUnion, doc, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { DBService, storageService } from "../../FireBase"

type Props = {
  userId: string
}

const Style = {
  PreviewImageSection: styled.div`
    width: 200px;
    height: 200px;
    border: 1px solid black;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  PreviewImage: styled.img`
    width: 150px;
    height: 150px;
  `,
}

export default function ProfilePageImageInput({ userId }: Props) {
  const [imageFile, setImageFile] = useState<File>()
  const [imageTitle, setImageTitle] = useState<string>("")
  const imageUploadRef = useRef<HTMLInputElement>(null)
  const [imagePreviewSrc, setImagePreviewSrc] = useState<string>("")
  const [imageUrlToFirestore, setImageUrlToFirestore] = useState<string>("")

  const encodeFileToBase64 = (fileblob: File) => {
    const reader = new FileReader()
    reader.readAsDataURL(fileblob)
    return new Promise(() => {
      reader.onload = () => {
        setImagePreviewSrc(String(reader.result))
      }
    })
  }

  const handleImageSelect: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    if (event.target.files !== null) {
      setImageFile(event.target.files[0])
      encodeFileToBase64(event.target.files[0])
    }
  }
  const handleImageTitle: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setImageTitle(event.target.value)
  }

  const handleImageSubmit: React.MouseEventHandler<HTMLButtonElement> = () => {
    const imageSubmitRef = ref(storageService, `images/${userId}/${imageTitle}`)
    if (imageFile !== undefined)
      uploadBytes(imageSubmitRef, imageFile).then(() => {
        getDownloadURL(imageSubmitRef).then((response) => {
          setImageUrlToFirestore(response)
        })
      })
    if (imageUploadRef.current !== null) {
      imageUploadRef.current.value = ""
    }
  }

  const uploadImageUrlListToFirestore = async (url: string, title: string) => {
    const imageUrlListRef = doc(DBService, "userData", userId)
    await updateDoc(imageUrlListRef, {
      images: arrayUnion({ image: url, imageTitle: title }),
    })
  }

  useEffect(() => {
    if (imageUrlToFirestore == "") return
    uploadImageUrlListToFirestore(imageUrlToFirestore, imageTitle)
    setImageTitle("")
    setImagePreviewSrc("")
  }, [imageUrlToFirestore])

  return (
    <>
      <input
        type={"text"}
        onChange={handleImageTitle}
        value={imageTitle}
        placeholder="이미지 제목?"
      />
      <input
        type={"file"}
        onChange={handleImageSelect}
        accept="image/*"
        ref={imageUploadRef}
      />
      <button onClick={handleImageSubmit}>이미지 업로드</button>
      <Style.PreviewImageSection>
        {(imagePreviewSrc !== undefined || imagePreviewSrc !== "") && (
          <Style.PreviewImage src={imagePreviewSrc} />
        )}
      </Style.PreviewImageSection>
    </>
  )
}
