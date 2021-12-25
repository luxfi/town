const Main = ({ children }) => (
  <main
    className="flex flex-col items-center justify-start flex-grow w-full h-full bg-black"
    style={{ height: 'max-content' }}
  >
    {children}
  </main>
)

export default Main
