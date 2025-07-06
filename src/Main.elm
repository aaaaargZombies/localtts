port module Main exposing (main)

-- import HelloWorld
-- import Msg exposing (Msg(..))

import Browser exposing (Document)
import Html exposing (Html, text)
import Html.Attributes
import Html.Events
import Json.Decode
import Json.Encode
import VitePluginHelper


type Msg
    = NoOp
    | UserClickedSubmit
    | UserUpdatedTextField String
    | UserClickedPlay Int
    | UserClickedPause
    | BrowserFinishedPlaying Int
    | UserToggledPlayAll


type alias Model =
    { playAll : Bool
    , currentTrack : Int
    , nextId : Int
    , texts : List ( String, Int )
    , textField : String
    }


type alias Flags =
    Json.Encode.Value


main : Program Flags Model Msg
main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


init : Flags -> ( Model, Cmd Msg )
init _ =
    ( { playAll = False, currentTrack = 0, nextId = 0, texts = [], textField = "" }, Cmd.none )


subscriptions : model -> Sub Msg
subscriptions _ =
    audioEnded BrowserFinishedPlaying


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        BrowserFinishedPlaying id ->
            if model.playAll then
                let
                    maxId =
                        model.texts |> List.map Tuple.second |> List.maximum |> Maybe.withDefault 0
                in
                if maxId == id then
                    ( { model | playAll = not model.playAll }, Cmd.none )

                else
                    ( { model | currentTrack = id + 1 }, playText <| id + 1 )

            else
                ( model, Cmd.none )

        UserUpdatedTextField text ->
            ( { model | textField = text }, Cmd.none )

        UserClickedPlay id ->
            ( { model | currentTrack = id }, playText id )

        UserToggledPlayAll ->
            ( { model | playAll = not model.playAll }, Cmd.none )

        UserClickedPause ->
            ( model, pauseText () )

        UserClickedSubmit ->
            let
                texts =
                    model.textField
                        |> String.split "\n"
                        |> List.map String.trim
                        |> List.filter (not << String.isEmpty)
                        |> List.indexedMap (\index s -> ( s, model.nextId + index ))

                nextId =
                    texts
                        |> List.map Tuple.second
                        |> List.maximum
                        |> Maybe.map ((+) 1)
                        |> Maybe.withDefault 0

                cmds =
                    texts
                        |> List.map sendText
                        |> List.reverse
                        |> Cmd.batch
            in
            ( { model | nextId = nextId, texts = model.texts ++ texts, textField = "" }, cmds )


formDecoder : Json.Decode.Decoder Msg
formDecoder =
    Json.Decode.succeed NoOp


viewAudio : ( String, Int ) -> Html Msg
viewAudio ( txt, id ) =
    Html.div []
        [ Html.p []
            [ Html.text txt ]
        , Html.button
            [ Html.Events.onClick <| UserClickedPlay id ]
            [ Html.text "Play" ]
        , Html.button
            [ Html.Events.onClick UserClickedPause ]
            [ Html.text "Pause" ]
        ]


view : Model -> Document Msg
view model =
    let
        audios =
            model.texts
                |> List.map viewAudio
    in
    { title = "locall tts"
    , body =
        [ Html.div []
            [ Html.h1 [] [ Html.text "Local TTS" ]
            , Html.div [] []
            , Html.textarea [ Html.Events.onInput UserUpdatedTextField, Html.Attributes.value model.textField ] []
            , Html.button [ Html.Events.onClick UserClickedSubmit ] [ Html.text "Submit" ]
            , Html.div []
                ([ Html.div []
                    [ Html.label []
                        [ Html.text "Play next automatically"
                        , Html.input [ Html.Events.onClick UserToggledPlayAll, Html.Attributes.type_ "checkbox", Html.Attributes.checked model.playAll ] []
                        ]
                    ]
                 ]
                    ++ audios
                )
            ]
        ]
    }


port sendText : ( String, Int ) -> Cmd msg


port playText : Int -> Cmd msg


port pauseText : () -> Cmd msg


port audioEnded : (Int -> msg) -> Sub msg
