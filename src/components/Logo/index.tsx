import {h} from 'preact';

interface Props {
  width?: number;
  height?: number;
}
export default ({width = 30, height = 30}: Props): JSX.Element => {
  return (
    <svg width={width} height={height} viewBox="-256 -256 512 512">
      <path
        d="M0,-256 221.7025033688164,-128 221.7025033688164,128 0,256 -221.7025033688164,128 -221.7025033688164,-128z"
        fill="white"
      />
      <ellipse
        cx="0"
        cy="0"
        stroke-dasharray="416.1929553294638 30.807044670536186"
        stroke-dashoffset="27790.570421873046"
        stroke-width="16px"
        rx="75px"
        ry="196px"
        fill="none"
        stroke="#673ab8"
        transform="rotate(52)"
      />
      <ellipse
        cx="0"
        cy="0"
        stroke-dasharray="377.89098046931156 69.10901953068846"
        stroke-dashoffset="-19309.07993846995"
        stroke-width="16px"
        rx="75px"
        ry="196px"
        fill="none"
        stroke="#673ab8"
        transform="rotate(-52)"
      />
      <circle cx="0" cy="0" r="34" fill="#673ab8" />
    </svg>
  );
};
