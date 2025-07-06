module HelloWorld exposing (view)

import Html exposing (Html, a, button, code, div, h1, p, text)
import Html.Attributes exposing (href, style)
import Html.Events exposing (onClick)
import Msg exposing (Msg(..))


view : Int -> Html Msg
view model =
    div []
        [ h1 [] [ text "Hello, from Vite + Elm!" ]
        , p []
            [ a [ href "https://vitejs.dev/guide/features.html" ] [ text "Vite Documentation" ]
            , text " | "
            , a [ href "https://guide.elm-lang.org/" ] [ text "Elm Documentation" ]
            ]
        , div
            [ style "display" "flex"
            , style "justify-content" "center"
            , style "align-items" "center"
            , style "gap" "1rem"
            ]
            [ button [ onClick Increment ] [ text "+" ]
            , text <| "Count is: " ++ String.fromInt model
            , button [ onClick Decrement ] [ text "-" ]
            ]
        , p []
            [ text "Edit "
            , code [] [ text "src/Main.elm" ]
            , text " to test auto refresh"
            ]
        ]
