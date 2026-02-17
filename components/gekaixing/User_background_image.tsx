"use client"

export default function User_background_image({
  backgroundImage,
}: {
  backgroundImage: string | null | undefined
}) {
  return (
    <div className="relative w-full h-[200px] bg-gray-400 overflow-hidden">
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt="User background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  )
}
