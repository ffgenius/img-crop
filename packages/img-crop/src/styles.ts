import { PREFIX } from './constants'

export const cssStyles = `.${PREFIX}-container {
  position: relative !important;
  width: 100%;
  height: 40vh;
}

.${PREFIX}-body > section:first-of-type {
  margin-top: 16px;
}

.${PREFIX}-body > section:last-of-type {
  margin-bottom: 16px;
}

.${PREFIX}-slider-row {
  display: flex;
  align-items: center;
  width: 60%;
  margin-inline: auto;
}

.${PREFIX}-slider {
  flex: 1;
}

.${PREFIX}-slider-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  background: transparent;
  border: 0;
  font-family: inherit;
  font-size: 18px;
  cursor: pointer;
}

.${PREFIX}-slider-btn:disabled {
  opacity: 20%;
  cursor: default;
}

.${PREFIX}-slider-btn-sm {
  font-size: 16px;
}

.${PREFIX}-reset-btn {
  position: absolute;
  bottom: 20px;
}
`
