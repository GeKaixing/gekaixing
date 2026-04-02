"use client"

export default function User_background_image({
  backgroundImage,
}: {
  backgroundImage: string | null | undefined
}) {
  return (
    <div className="relative h-[140px] w-full overflow-hidden bg-gray-400 sm:h-[200px]">
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
