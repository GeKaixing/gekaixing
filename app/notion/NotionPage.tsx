// components/NotionPage.tsx
"use client";

import { NotionRenderer } from "react-notion-x";
// core styles shared by all of react-notion-x (required
import "react-notion-x/src/styles.css";

// // used for code syntax highlighting (optional)
// import 'prismjs/themes/prism-tomorrow.css'

// // used for rendering equations (optional)
// import 'katex/dist/katex.min.css'

import dynamic from 'next/dynamic'  

const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then((m) => m.Code)
)
const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then(
    (m) => m.Collection
  )
)
const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
)
const Pdf = dynamic(
  () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
  {
    ssr: false
  }
)
const Modal = dynamic(
  () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
  {
    ssr: false
  }
)

export default function NotionPage({ recordMap }: { recordMap: any, }) {
  return<NotionRenderer
    recordMap={recordMap}
    fullPage={true}
    darkMode={false}
    components={{
      Code,
      Collection,
      Equation,
      Modal,
      Pdf
    }}
  />;
}