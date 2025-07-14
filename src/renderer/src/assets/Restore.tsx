const Restore = (props: any): React.JSX.Element => (
  <svg width={props.size} height={props.size} viewBox="0 0 24 28" fill="none" {...props}>
    <path
      stroke={props.color}
      d="M20.698 5.268v-.495l-.496-.004-15.438-.11V.5H24.97v18.575h-4.242l-.03-13.807Z"
    />
    <path stroke={props.color} d="M.5 4.763h20.207v18.575H.5z" />
  </svg>
)
export default Restore
