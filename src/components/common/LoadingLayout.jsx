import { BeatLoader } from "react-spinners"

const LoadingLayout = (props) => {
  if(props.isLoading)
    return (
      <div className="center">
      <BeatLoader size={40} color="rgb(0, 87, 181)" />
    </div>)

  return props.children
}

export default LoadingLayout