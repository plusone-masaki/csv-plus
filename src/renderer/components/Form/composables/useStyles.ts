import { reactive } from 'vue'

export type StyleProp = {
  absolute?: boolean;
  fixed?: boolean;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
}

const generatePosition = (props: StyleProp) => {
  let position = 'relative'
  if (props.absolute) position = 'absolute'
  if (props.fixed) position = 'fixed'
  return position
}

const generateLayout = (props: StyleProp) => ({
  top: props.top ? 0 : 'auto',
  bottom: props.bottom ? 0 : 'auto',
  right: props.right ? '16px' : 'auto',
  left: props.left ? 0 : 'auto',
})

export default (props: StyleProp) => reactive({
  position: generatePosition(props),
  ...generateLayout(props),
})
