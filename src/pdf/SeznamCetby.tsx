import React from "react";

import { Font, Document, Page, Text, View } from '@react-pdf/renderer';

import { BookItem } from '../database/databaseStructure';

Font.register({
    family: "Arial", fonts: [
        { src: `${process.env.PUBLIC_URL}/static/font/arial-default.ttf` },
        { src: `${process.env.PUBLIC_URL}/static/font/arial-bold.ttf`, fontWeight: "bold" }
    ]
});

Font.registerHyphenationCallback(word => (
    [word]
));

// Create Document Component
export default function SeznamCetby(props: {
    personName: string,
    personClass: string,
    yearOfExam: string,
    dateOfIssue: string | null,
    pronouncement: boolean,
    books: BookItem[]
}) {

    const sorted = React.useMemo(() => {

        const authors = {} as Record<number,number>;

        props.books.forEach(book => {
            book.authors.forEach(author => {
                if (!authors[author.id] || authors[author.id] > book.published)
                    authors[author.id] = book.published;
            })
        })

        const sorted = props.books.sort((a,b) => 
            Math.min(...a.authors.map(ax => authors[ax.id]), a.published) -  Math.min(...b.authors.map(bx => authors[bx.id]), b.published) ||
            (a.authors[0]?.short ?? "").localeCompare(b.authors[0]?.short ?? "") ||
            (a.published) - (b.published)
        )

        return sorted;
    }, [ props.books ]);

    return (
        <Document
            title={`Seznam četby - ${props.personName}`}
        >
            <Page size="A4" style={{
                fontFamily: "Arial",
                lineHeight: "1.2",
                textAlign: "center",
                padding: "2.5cm",
                display: "flex",
                flexDirection: "column",
            }}>
                <View style={{
                    textAlign: "center",
                    fontWeight: "bold",
                }}>
                    <Text style={{
                        fontSize: 16,
                    }}>
                        {"Gymnázium a SOŠ Rokycany"}
                    </Text>
                    <Padder padding={5} />
                    <Text style={{
                        fontSize: 12,
                    }}>
                        {`Seznam literárních děl k ústní části maturitní zkoušky ${props.yearOfExam}\nčeský jazyk`}
                    </Text>
                </View>
                <Padder padding={16} />
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    textAlign: "left",
                }}>
                    {/* <View style={{
                        flex: 1,
                    }}>
                        <Text style={{ fontSize: 10, fontWeight: "normal", }}>{"Typ zkoušky"}</Text>
                        <Padder padding={3} />
                        <Text style={{ fontSize: 16, fontWeight: "bold", paddingRight: 10 }}>{"Povinná"}</Text>
                    </View> */}
                    <View style={{
                        flex: 3, // flex: 2,
                    }}>
                        <Text style={{ fontSize: 10, fontWeight: "normal", }}>{"Jméno studenta"}</Text>
                        <Padder padding={3} />
                        <Text style={{ fontSize: 16, fontWeight: "bold", paddingRight: 10 }}>{props.personName}</Text>
                    </View>
                    <View style={{
                        flex: 1,
                    }}>
                        <Text style={{ fontSize: 10, fontWeight: "normal", }}>{"Třída"}</Text>
                        <Padder padding={3} />
                        <Text style={{ fontSize: 16, fontWeight: "bold", paddingRight: 10 }}>{props.personClass}</Text>
                    </View>
                </View>
                <Padder padding={16} />
                <View style={{
                    flex: 1,
                    fontSize: 10
                }}>
                    <Separator orientation="vertical"/>
                    <Row
                        first={<Text style={{ fontWeight: "bold" }}>{"Pořadové číslo"}</Text>}
                        second={<Text style={{ fontWeight: "bold" }}>{"Číslo ve školním seznamu"}</Text>}
                        flex={<Text style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}>{"Autor, název díla"}</Text>}
                    />
                    <Separator orientation="vertical"/>
                    { sorted.map((book, index) => (
                            <>
                                <Row
                                    first={<Text>{`${index + 1}.`}</Text>}
                                    second={<Text>{`${book.id}.`}</Text>}
                                    flex={<Text>{book.authors.length > 0 && (book.authors.map(author => author.short).join(", ") + ": ")}{book.name}</Text>}
                                />
                                <Separator orientation="vertical"/>
                            </>
                        ))
                    }
                </View>
                <Padder padding={16} />
                <View break={false} style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-end",
                    fontSize: 12,
                }}>
                    <View style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}>
                        {props.dateOfIssue && (<Text>{props.dateOfIssue}</Text>)}
                        <Text style={{ marginTop: -5, letterSpacing: 1,  }}>{"...................................."}</Text>
                        <Text style={{ fontSize: 10, }}>{"Datum"}</Text>
                    </View>
                    <View style={{ flexGrow: 1, }}/>
                    <View style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}>
                        <Text style={{ marginTop: -5, letterSpacing: 1, }}>{"...................................."}</Text>
                        <Text style={{ fontSize: 10, }}>{"Podpis"}</Text>
                    </View>
                </View>
            </Page>
            { props.pronouncement && (<Page style={{
                fontFamily: "Arial",
                lineHeight: "1.2",
                padding: "2.5cm",
                display: "flex",
                flexDirection: "column",
            }}>
                <View style={{
                    fontSize: 12,
                }}>
                    <Text>{"Čestně prohlašuji,"}</Text>
                    <Padder padding={5}/>
                    <Text>{"že výběr titulů odpovídá kritériím stanoveným předmětovou komisí ČJL."}</Text>
                </View>
                <Padder padding={30} />
                <View break={false} style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-end",
                    fontSize: 12,
                }}>
                    <View style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}>
                        {props.dateOfIssue && (<Text>{props.dateOfIssue}</Text>)}
                        <Text style={{ marginTop: -5, letterSpacing: 1,  }}>{"...................................."}</Text>
                        <Text style={{ fontSize: 10, }}>{"Datum"}</Text>
                    </View>
                    <View style={{ flexGrow: 1, }}/>
                    <View style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}>
                        <Text style={{ marginTop: -5, letterSpacing: 1,  }}>{"...................................."}</Text>
                        <Text style={{ fontSize: 10, }}>{"Podpis"}</Text>
                    </View>
                </View>
            </Page>) }
        </Document>
    );
};

const Row = (props: {
    first: React.ReactNode,
    second: React.ReactNode,
    flex: React.ReactNode,
}) => {

    return (
        <View style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
        }}> 
            <Separator/>
            <View style={{
                padding: 3,
                textAlign: "center",
                width: 50
            }}>
                {props.first}
            </View>
            <Separator/>
            <View style={{
                padding: 3,
                textAlign: "center",
                width: 50
            }}>
                {props.second}
            </View>
            <Separator/>
            <View style={{
                padding: 5,
                textAlign: "left",
                flex: 1
            }}>
                {props.flex}
            </View>
            <Separator/>
        </View>
    );

}

const Padder = (props: {
    padding: number
}) => {
    return (
        <View style={{
            paddingTop: props.padding
        }}/>
    );
}

const Separator = (props: {
    orientation?: "horizontal" | "vertical" | undefined
}) => {

    return (
        <View style={props.orientation === "vertical" ? {
            borderTop: "1pt solid black",
            alignSelf: "stretch"
        } : {
            borderLeft: "1pt solid black",
            alignSelf: "stretch"
        }}/>
    );

}

